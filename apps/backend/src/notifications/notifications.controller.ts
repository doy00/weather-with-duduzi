import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Headers,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { SubscribePushDto } from './dto/subscribe-push.dto';
import { CreateNotificationSettingDto } from './dto/create-notification-setting.dto';
import { UpdateNotificationSettingDto } from './dto/update-notification-setting.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('subscribe')
  async subscribePush(
    @Body() dto: SubscribePushDto,
    @Headers('user-agent') userAgent?: string
  ) {
    return this.notificationsService.subscribePush(dto, userAgent);
  }

  @Post('settings')
  async createNotificationSetting(
    @Body() dto: CreateNotificationSettingDto & { subscription_id: string }
  ) {
    const { subscription_id, ...settingDto } = dto;
    return this.notificationsService.createNotificationSetting(
      subscription_id,
      settingDto
    );
  }

  @Get('settings/favorite/:favoriteId')
  async getNotificationSettingsByFavorite(@Param('favoriteId') favoriteId: string) {
    return this.notificationsService.getNotificationSettingsByFavorite(favoriteId);
  }

  @Patch('settings/:id')
  async updateNotificationSetting(
    @Param('id') id: string,
    @Body() dto: UpdateNotificationSettingDto
  ) {
    return this.notificationsService.updateNotificationSetting(id, dto);
  }

  @Delete('settings/:id')
  async deleteNotificationSetting(@Param('id') id: string) {
    return this.notificationsService.deleteNotificationSetting(id);
  }
}
