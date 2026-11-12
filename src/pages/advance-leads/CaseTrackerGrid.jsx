import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import SearchableSelect from '../../components/ui/SearchableSelect'
import { TRACKER_COLUMNS, CASE_STATUS_COLORS } from '../../constants/caseTracker'
import { normalizePhoneInput, validatePhone } from '../../utils/validation'

const toInputDate = (value) => {
  if (!value) return ''
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) {
    return value.slice(0, 10)
  }
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

const displayValue = (row, key, sr) => {
  if (key === 'sr') return sr
  if (key === 'margin_percent') {
    return row.margin_percent === null || row.margin_percent === undefined || row.margin_percent === ''
      ? ''
      : `${row.margin_percent}%`
  }
  if (key === 'days_open') return row.days_open ?? ''
  if (['total_exp', 'net_profit', 'gross_fee', 'paper_office_exp', 'cidco_fees'].includes(key)) {
    const n = row[key]
    return n === null || n === undefined || n === '' ? '' : Number(n).toLocaleString('en-IN')
  }
  if (key === 'date_opened' || key === 'next_action_date') {
    const raw = row[key]
    if (!raw) return ''
    const d = new Date(raw)
    if (Number.isNaN(d.getTime())) return raw
    return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getFullYear()).slice(-2)}`
  }
  return row[key] ?? ''
}

const agingRowClass = (row, idx) => {
  const days = Number(row.days_open)
  if (row.case_status === 'Completed') {
    return idx % 2 === 0 ? 'bg-white dark:bg-secondary-800' : 'bg-secondary-50 dark:bg-secondary-900/60'
  }
  if (!Number.isNaN(days) && days > 90) return 'bg-rose-50 dark:bg-rose-950/40'
  if (!Number.isNaN(days) && days > 60) return 'bg-orange-50 dark:bg-orange-950/40'
  if (!Number.isNaN(days) && days > 30) return 'bg-amber-50 dark:bg-amber-950/40'
  return idx % 2 === 0 ? 'bg-white dark:bg-secondary-800' : 'bg-secondary-50 dark:bg-secondary-900/60'
}

const agingBadgeClass = (days) => {
  const n = Number(days)
  if (Number.isNaN(n) || days === null || days === undefined || days === '') return 'text-secondary-700 dark:text-secondary-300'
  if (n > 90) return 'text-rose-700 dark:text-rose-400 font-bold'
  if (n > 60) return 'text-orange-700 dark:text-orange-400 font-semibold'
  if (n > 30) return 'text-amber-700 dark:text-amber-400 font-semibold'
  return 'text-secondary-700 dark:text-secondary-300'
}

const stickyLeft = (key) => {
  if (key === 'sr') return 0
  if (key === 'name') return 56
  return null
}

const EditableCell = memo(function EditableCell({
  row,
  column,
  rowIndex,
  colIndex,
  sr,
  isFocused,
  isEditing,
  isSaving,
  justSaved,
  onStartEdit,
  onCommit,
  onCancel,
  onFocusCell,
}) {
  const inputRef = useRef(null)
  const [draft, setDraft] = useState('')

  useEffect(() => {
    if (!isEditing) return
    let initial = row[column.key] ?? ''
    if (column.type === 'date') initial = toInputDate(initial)
    if (column.type === 'number') initial = initial === null || initial === undefined ? '' : initial
    if (column.type === 'tel') initial = normalizePhoneInput(initial)
    setDraft(String(initial))
    requestAnimationFrame(() => {
      inputRef.current?.focus?.()
      inputRef.current?.select?.()
    })
  }, [isEditing, row, column])

  useEffect(() => {
    if (!isEditing || column.type !== 'select') return
    const onKey = (e) => {
      if (e.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isEditing, column.type, onCancel])

  if (column.readOnly) {
    const tone =
      column.key === 'net_profit'
        ? Number(row.net_profit) >= 0
          ? 'text-emerald-700 font-medium'
          : 'text-rose-700 font-medium'
        : column.key === 'days_open'
          ? agingBadgeClass(row.days_open)
          : 'text-secondary-700 dark:text-secondary-300'

    return (
      <div className={`px-2 py-1.5 text-xs whitespace-nowrap ${tone}`}>
        {displayValue(row, column.key, sr)}
      </div>
    )
  }

  if (isEditing) {
    const sharedProps = {
      ref: inputRef,
      className: 'w-full h-8 text-xs border-2 border-sky-500 bg-white dark:bg-secondary-900 dark:text-white px-1 outline-none shadow-sm',
      value: draft,
      onChange: (e) => {
        const next = column.type === 'tel'
          ? normalizePhoneInput(e.target.value)
          : e.target.value
        setDraft(next)
      },
      onBlur: () => onCommit(rowIndex, colIndex, 'stay', draft),
      onKeyDown: (e) => {
        if (e.key === 'Enter') {
          e.preventDefault()
          onCommit(rowIndex, colIndex, e.shiftKey ? 'up' : 'down', draft)
        } else if (e.key === 'Tab') {
          e.preventDefault()
          onCommit(rowIndex, colIndex, e.shiftKey ? 'left' : 'right', draft)
        } else if (e.key === 'Escape') {
          e.preventDefault()
          onCancel()
        }
      },
    }

    if (column.type === 'select') {
      const selectOptions = [
        { value: '', label: 'Select' },
        ...(column.options || []).map((opt) => (
          typeof opt === 'string' ? { value: opt, label: opt } : opt
        )),
      ]
      return (
        <SearchableSelect
          compact
          value={draft}
          options={selectOptions}
          placeholder="Select..."
          searchPlaceholder="Search..."
          onChange={(e) => {
            const next = e.target.value
            setDraft(next)
            onCommit(rowIndex, colIndex, 'stay', next)
          }}
        />
      )
    }

    return (
      <input
        {...sharedProps}
        type={column.type === 'number' ? 'number' : column.type === 'date' ? 'date' : column.type === 'tel' ? 'tel' : 'text'}
        inputMode={column.type === 'tel' ? 'numeric' : undefined}
        maxLength={column.type === 'tel' ? 10 : undefined}
        minLength={column.type === 'tel' ? 10 : undefined}
        min={column.type === 'number' ? 0 : undefined}
        step={column.type === 'number' ? '0.01' : undefined}
      />
    )
  }

  const statusClass =
    column.key === 'case_status'
      ? (CASE_STATUS_COLORS[row.case_status] || 'bg-slate-100 text-slate-800')
      : ''

  return (
    <button
      type="button"
      data-cell={`${rowIndex}-${colIndex}`}
      onClick={() => {
        onFocusCell(rowIndex, colIndex)
        onStartEdit(rowIndex, colIndex)
      }}
      onFocus={() => onFocusCell(rowIndex, colIndex)}
      disabled={isSaving}
      className={`w-full text-left px-2 py-1.5 text-xs min-h-[32px] whitespace-nowrap
        ${isFocused ? 'ring-2 ring-inset ring-sky-400 bg-sky-50' : 'hover:bg-sky-50'}
        ${justSaved ? 'bg-emerald-100 ring-1 ring-inset ring-emerald-400' : ''}
        ${isSaving ? 'opacity-60' : ''}
        ${statusClass}
        focus:outline-none`}
      title="Click or press Enter to edit · Arrows to move"
    >
      {displayValue(row, column.key, sr) || <span className="text-secondary-300 dark:text-secondary-600">—</span>}
      {justSaved ? <span className="ml-1 text-[10px] text-emerald-700 font-semibold">Saved</span> : null}
    </button>
  )
})

const TrackerRow = memo(function TrackerRow({
  row,
  rowIndex,
  sr,
  columns,
  focusCol,
  editingCol,
  savingField,
  savedField,
  onStartEdit,
  onCommit,
  onCancel,
  onFocusCell,
}) {
  return (
    <tr className={agingRowClass(row, rowIndex)} style={{ contentVisibility: 'auto', containIntrinsicSize: '0 34px' }}>
      {columns.map((col, colIndex) => {
        const left = stickyLeft(col.key)
        return (
          <td
            key={col.key}
            style={{ width: col.width, minWidth: col.width, left: left ?? undefined }}
            className={`border border-secondary-200 dark:border-secondary-700 p-0 align-middle ${
              left !== null ? 'sticky z-10 bg-inherit' : ''
            }`}
          >
            <EditableCell
              row={row}
              column={col}
              rowIndex={rowIndex}
              colIndex={colIndex}
              sr={sr}
              isFocused={focusCol === colIndex}
              isEditing={editingCol === colIndex}
              isSaving={savingField === col.key}
              justSaved={savedField === col.key}
              onStartEdit={onStartEdit}
              onCommit={onCommit}
              onCancel={onCancel}
              onFocusCell={onFocusCell}
            />
          </td>
        )
      })}
    </tr>
  )
})

export default function CaseTrackerGrid({
  rows,
  loading,
  savingKey,
  savedKey,
  onSaveCell,
  startSr = 1,
  compact = true,
  columnOptions = {},
}) {
  const columns = useMemo(
    () => TRACKER_COLUMNS.map((col) => (
      columnOptions[col.key]
        ? { ...col, options: columnOptions[col.key] }
        : col
    )),
    [columnOptions]
  )

  const columnsRef = useRef(columns)
  useEffect(() => {
    columnsRef.current = columns
  }, [columns])

  const editableCols = useMemo(
    () => columns.map((col, index) => ({ col, index })).filter(({ col }) => !col.readOnly),
    [columns]
  )

  const [focus, setFocus] = useState({ row: 0, col: 0 })
  const [editing, setEditing] = useState(null)
  const gridRef = useRef(null)
  const focusRef = useRef(focus)
  const rowsRef = useRef(rows)

  useEffect(() => {
    focusRef.current = focus
  }, [focus])

  useEffect(() => {
    rowsRef.current = rows
  }, [rows])

  const totals = useMemo(() => {
    return rows.reduce(
      (acc, row) => {
        acc.gross += Number(row.gross_fee || 0)
        acc.paper += Number(row.paper_office_exp || 0)
        acc.cidco += Number(row.cidco_fees || 0)
        acc.exp += Number(row.total_exp || 0)
        acc.profit += Number(row.net_profit || 0)
        return acc
      },
      { gross: 0, paper: 0, cidco: 0, exp: 0, profit: 0 }
    )
  }, [rows])

  const findEditableIndex = useCallback((colIndex) => {
    return editableCols.findIndex(({ index }) => index === colIndex)
  }, [editableCols])

  const moveFocus = useCallback((row, editableOffset, absoluteColIndex = null) => {
    const currentRows = rowsRef.current
    if (!currentRows.length || !editableCols.length) return

    let nextRow = row
    const currentFocus = focusRef.current
    let editIdx = absoluteColIndex !== null
      ? findEditableIndex(absoluteColIndex)
      : findEditableIndex(currentFocus.col)

    if (editIdx < 0) editIdx = 0
    editIdx += editableOffset

    while (editIdx < 0) {
      nextRow -= 1
      editIdx += editableCols.length
    }
    while (editIdx >= editableCols.length) {
      nextRow += 1
      editIdx -= editableCols.length
    }

    nextRow = Math.max(0, Math.min(currentRows.length - 1, nextRow))
    const nextCol = editableCols[editIdx].index
    setFocus({ row: nextRow, col: nextCol })

    requestAnimationFrame(() => {
      const el = gridRef.current?.querySelector(`[data-cell="${nextRow}-${nextCol}"]`)
      el?.focus?.()
    })
  }, [editableCols, findEditableIndex])

  const startEdit = useCallback((rowIndex, colIndex) => {
    const column = columnsRef.current[colIndex]
    if (!column || column.readOnly) return
    if (!rowsRef.current[rowIndex]) return
    setFocus({ row: rowIndex, col: colIndex })
    setEditing({ row: rowIndex, col: colIndex })
  }, [])

  const cancelEdit = useCallback(() => {
    const current = focusRef.current
    setEditing(null)
    requestAnimationFrame(() => {
      const el = gridRef.current?.querySelector(`[data-cell="${current.row}-${current.col}"]`)
      el?.focus?.()
    })
  }, [])

  const commitEdit = useCallback((rowIndex, colIndex, move = 'stay', draftValue = '') => {
    const column = columnsRef.current[colIndex]
    const row = rowsRef.current[rowIndex]
    if (!column || !row) {
      setEditing(null)
      return
    }

    let nextValue = draftValue
    if (column.type === 'number') {
      nextValue = draftValue === '' ? 0 : Number(draftValue)
      if (Number.isNaN(nextValue)) {
        cancelEdit()
        return
      }
    }
    if (column.type === 'date') {
      nextValue = draftValue || null
    }
    if (column.type === 'tel') {
      nextValue = normalizePhoneInput(draftValue)
      const phoneError = validatePhone(nextValue, false, column.label || 'Phone')
      if (phoneError) {
        // Keep editor open until value is empty or exactly 10 digits
        return
      }
      nextValue = nextValue || ''
    }

    const current = column.type === 'date' ? toInputDate(row[column.key]) : row[column.key]
    const normalizedCurrent = current === null || current === undefined ? '' : String(current)
    const normalizedNext = nextValue === null || nextValue === undefined ? '' : String(nextValue)

    setEditing(null)

    if (normalizedCurrent !== normalizedNext) {
      // Fire-and-forget — parent applies optimistic update immediately
      void onSaveCell(row.id, column.key, nextValue)
    }

    if (move === 'down') moveFocus(rowIndex + 1, 0, colIndex)
    else if (move === 'up') moveFocus(rowIndex - 1, 0, colIndex)
    else if (move === 'right') moveFocus(rowIndex, 1)
    else if (move === 'left') moveFocus(rowIndex, -1)
    else {
      requestAnimationFrame(() => {
        const el = gridRef.current?.querySelector(`[data-cell="${rowIndex}-${colIndex}"]`)
        el?.focus?.()
      })
    }
  }, [cancelEdit, moveFocus, onSaveCell])

  const onFocusCell = useCallback((r, c) => {
    setFocus({ row: r, col: c })
  }, [])

  useEffect(() => {
    const onKeyDown = (e) => {
      if (editing) return
      if (!rowsRef.current.length) return
      const active = document.activeElement
      if (!gridRef.current?.contains(active) && !active?.hasAttribute?.('data-cell')) return

      const current = focusRef.current

      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', 'F2'].includes(e.key)) {
        e.preventDefault()
      }

      if (e.key === 'ArrowDown') moveFocus(current.row + 1, 0, current.col)
      if (e.key === 'ArrowUp') moveFocus(current.row - 1, 0, current.col)
      if (e.key === 'ArrowRight' || (e.key === 'Tab' && !e.shiftKey)) {
        e.preventDefault()
        moveFocus(current.row, 1)
      }
      if (e.key === 'ArrowLeft' || (e.key === 'Tab' && e.shiftKey)) {
        e.preventDefault()
        moveFocus(current.row, -1)
      }
      if (e.key === 'Enter' || e.key === 'F2') startEdit(current.row, current.col)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [editing, moveFocus, startEdit])

  const footerCell = (col) => {
    if (col.key === 'sr') return rows.length ? `${rows.length}` : '0'
    if (col.key === 'name') return 'TOTALS'
    if (col.key === 'gross_fee') return totals.gross.toLocaleString('en-IN')
    if (col.key === 'paper_office_exp') return totals.paper.toLocaleString('en-IN')
    if (col.key === 'cidco_fees') return totals.cidco.toLocaleString('en-IN')
    if (col.key === 'total_exp') return totals.exp.toLocaleString('en-IN')
    if (col.key === 'net_profit') return totals.profit.toLocaleString('en-IN')
    if (col.key === 'margin_percent') {
      return totals.gross > 0 ? `${((totals.profit / totals.gross) * 100).toFixed(2)}%` : ''
    }
    return ''
  }

  return (
    <div className="border border-secondary-300 dark:border-secondary-700 rounded-lg overflow-hidden bg-white dark:bg-secondary-800 shadow-sm" ref={gridRef} tabIndex={0}>
      <div className="px-3 py-1.5 bg-secondary-100 dark:bg-secondary-900 border-b border-secondary-200 dark:border-secondary-700 text-[11px] text-secondary-600 dark:text-secondary-400 flex flex-wrap gap-x-4 gap-y-1">
        <span className="hidden lg:inline"><kbd className="px-1 rounded bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-600">↑↓←→</kbd> move</span>
        <span className="hidden lg:inline"><kbd className="px-1 rounded bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-600">Enter</kbd> edit</span>
        <span className="hidden lg:inline"><kbd className="px-1 rounded bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-600">Tab</kbd> next field</span>
        <span className="hidden lg:inline"><kbd className="px-1 rounded bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-600">Esc</kbd> cancel</span>
        <span className="lg:hidden text-secondary-500 dark:text-secondary-500">Swipe sideways to see more columns</span>
        <span className="text-amber-700 dark:text-amber-400">30d+</span>
        <span className="text-orange-700 dark:text-orange-400">60d+</span>
        <span className="text-rose-700 dark:text-rose-400">90d+</span>
      </div>

      <div
        className={`overflow-auto overscroll-x-contain ${compact ? 'max-h-[calc(100vh-280px)] sm:max-h-[calc(100vh-250px)]' : 'max-h-[calc(100vh-420px)] sm:max-h-[calc(100vh-390px)]'}`}
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <table className="border-collapse min-w-max w-full text-[11px] sm:text-xs">
          <thead className="sticky top-0 z-20">
            <tr>
              {columns.map((col) => {
                const left = stickyLeft(col.key)
                return (
                  <th
                    key={col.key}
                    style={{ width: col.width, minWidth: col.width, left: left ?? undefined }}
                    className={`bg-[#1F4E79] text-white text-[11px] font-semibold px-2 py-2 border border-[#163B5C] text-left whitespace-nowrap ${
                      left !== null ? 'sticky z-30' : ''
                    }`}
                  >
                    {col.label}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="py-16 text-center text-sm text-secondary-500 dark:text-secondary-400">
                  Loading case tracker...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-16 text-center text-sm text-secondary-500 dark:text-secondary-400">
                  No cases yet. Click &quot;Add Case&quot; to create the first row.
                </td>
              </tr>
            ) : (
              rows.map((row, rowIndex) => {
                const idPrefix = `${row.id}:`
                return (
                  <TrackerRow
                    key={row.id}
                    row={row}
                    rowIndex={rowIndex}
                    sr={startSr + rowIndex}
                    columns={columns}
                    focusCol={focus.row === rowIndex ? focus.col : -1}
                    editingCol={editing?.row === rowIndex ? editing.col : -1}
                    savingField={savingKey?.startsWith(idPrefix) ? savingKey.slice(idPrefix.length) : null}
                    savedField={savedKey?.startsWith(idPrefix) ? savedKey.slice(idPrefix.length) : null}
                    onStartEdit={startEdit}
                    onCommit={commitEdit}
                    onCancel={cancelEdit}
                    onFocusCell={onFocusCell}
                  />
                )
              })
            )}
          </tbody>
          {!loading && rows.length > 0 && (
            <tfoot className="sticky bottom-0 z-20">
              <tr>
                {columns.map((col) => {
                  const left = stickyLeft(col.key)
                  const value = footerCell(col)
                  const emphasize = ['gross_fee', 'total_exp', 'net_profit', 'margin_percent', 'name'].includes(col.key)
                  return (
                    <td
                      key={`footer-${col.key}`}
                      style={{ width: col.width, minWidth: col.width, left: left ?? undefined }}
                      className={`border border-[#163B5C] px-2 py-2 text-xs font-semibold whitespace-nowrap bg-[#1F4E79] text-white ${
                        left !== null ? 'sticky z-30' : ''
                      } ${col.key === 'net_profit' ? (totals.profit >= 0 ? 'text-emerald-200' : 'text-rose-200') : ''} ${
                        emphasize ? '' : 'text-slate-200'
                      }`}
                    >
                      {value}
                    </td>
                  )
                })}
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  )
}
