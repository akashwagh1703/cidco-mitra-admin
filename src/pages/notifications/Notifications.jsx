import { useState, useEffect } from 'react'
import { Bell, CheckCheck } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Tabs from '../../components/ui/Tabs'
import useNotificationStore from '../../store/notificationStore'
import { formatRelativeTime } from '../../utils/formatters'
import { notificationService } from '../../services/notificationService'
import useToastStore from '../../store/toastStore'

export default function Notifications() {
  const { setNotifications } = useNotificationStore()
  const { success, error } = useToastStore()
  const [notifications, setLocalNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      const response = await notificationService.getNotifications()
      if (response.success) {
        setLocalNotifications(response.data)
        setNotifications(response.data)
      }
    } catch (err) {
      error('Failed to fetch notifications')
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAllRead = async () => {
    try {
      const response = await notificationService.markAllAsRead()
      if (response.success) {
        success('All notifications marked as read')
        fetchNotifications()
      }
    } catch (err) {
      error('Failed to mark notifications as read')
    }
  }

  const unreadNotifications = notifications.filter(n => !n.read_at)
  const readNotifications = notifications.filter(n => n.read_at)

  const NotificationList = ({ items }) => (
    <div className="space-y-3">
      {items.length === 0 ? (
        <div className="text-center py-8 text-secondary-600">
          No notifications
        </div>
      ) : (
        items.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg border transition-colors ${
              notification.read_at ? 'bg-white border-secondary-200' : 'bg-blue-50 border-blue-200'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${notification.read_at ? 'bg-secondary-100' : 'bg-blue-100'}`}>
                <Bell size={20} className={notification.read_at ? 'text-secondary-600' : 'text-blue-600'} />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-secondary-900">{notification.title}</h4>
                <p className="text-sm text-secondary-600 mt-1">{notification.message}</p>
                <p className="text-xs text-secondary-500 mt-2">
                  {formatRelativeTime(notification.created_at)}
                </p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )

  const tabs = [
    {
      label: `All (${notifications.length})`,
      content: <NotificationList items={notifications} />
    },
    {
      label: `Unread (${unreadNotifications.length})`,
      content: <NotificationList items={unreadNotifications} />
    },
    {
      label: `Read (${readNotifications.length})`,
      content: <NotificationList items={readNotifications} />
    }
  ]

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Stay updated with system activities"
        action={
          <Button variant="ghost" onClick={handleMarkAllRead}>
            <CheckCheck size={16} className="mr-2" />
            Mark All as Read
          </Button>
        }
      />

      <Card>
        <Tabs tabs={tabs} />
      </Card>
    </div>
  )
}
