import { useNotificationPermission } from '../hooks/useNotificationPermission';
import { useFavoritesQuery } from '@/features/favorites/hooks/useFavoritesQuery';
import { NotificationSettingCard } from '../components/NotificationSettingCard';
import { createNotificationSetting } from '../services/notificationApi';

export function NotificationSettingsPage() {
  const { permission, requestPermission, isLoading, subscriptionId } = useNotificationPermission();
  const { favorites } = useFavoritesQuery();

  const isGranted = permission === 'granted';
  const isDenied = permission === 'denied';

  const handleSaveNotification = async (data: {
    favorite_id: string;
    subscription_id: string;
    enabled: boolean;
    scheduled_time?: string;
    scheduled_days?: number[];
  }) => {
    await createNotificationSetting(data);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">날씨 알림 설정</h1>

      {/* 알림 권한 상태 */}
      <div className="glass p-6 rounded-lg mb-8">
        {isDenied && (
          <div className="text-red-500">
            <p className="font-semibold mb-2">❌ 알림이 차단되었습니다</p>
            <p className="text-sm">
              브라우저 설정에서 알림 권한을 허용해주세요.
            </p>
          </div>
        )}

        {permission === 'default' && (
          <div>
            <p className="mb-4">날씨 알림을 받으려면 권한을 허용해주세요.</p>
            <button
              onClick={requestPermission}
              disabled={isLoading}
              className="glass px-6 py-3 rounded-lg font-medium hover:opacity-80 transition disabled:opacity-50"
            >
              {isLoading ? '설정 중...' : '알림 권한 허용'}
            </button>
          </div>
        )}

        {isGranted && (
          <div className="text-green-500">
            <p className="font-semibold">✅ 알림이 활성화되어 있습니다</p>
            <p className="text-sm mt-2 text-white/70">
              즐겨찾기를 추가하고 알림 시간을 설정하세요.
            </p>
          </div>
        )}
      </div>

      {/* 즐겨찾기별 알림 설정 */}
      {isGranted && subscriptionId && (
        <div>
          <h2 className="text-xl font-semibold mb-4">즐겨찾기별 알림</h2>

          {favorites.length === 0 ? (
            <p className="text-white/70">
              즐겨찾기를 추가하면 알림을 설정할 수 있습니다.
            </p>
          ) : (
            <div className="space-y-4">
              {favorites.map(favorite => (
                <NotificationSettingCard
                  key={favorite.id}
                  favorite={favorite}
                  subscriptionId={subscriptionId}
                  onSave={handleSaveNotification}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
