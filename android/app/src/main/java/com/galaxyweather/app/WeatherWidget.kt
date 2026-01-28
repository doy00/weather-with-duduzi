package com.galaxyweather.app

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.widget.RemoteViews
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import org.json.JSONObject
import java.net.URL
import java.text.SimpleDateFormat
import java.util.*

class WeatherWidget : AppWidgetProvider() {
    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        for (appWidgetId in appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId)
        }
    }
}

internal fun updateAppWidget(
    context: Context,
    appWidgetManager: AppWidgetManager,
    appWidgetId: Int
) {
    val prefs = context.getSharedPreferences("WeatherWidget", Context.MODE_PRIVATE)
    val lat = prefs.getFloat("lat", 37.5665f)
    val lon = prefs.getFloat("lon", 126.9780f)

    val views = RemoteViews(context.packageName, R.layout.weather_widget)

    // 앱 열기 인텐트
    val intent = Intent(context, MainActivity::class.java)
    val pendingIntent = PendingIntent.getActivity(
        context, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
    )
    views.setOnClickPendingIntent(R.id.widget_container, pendingIntent)

    // 날씨 데이터 비동기 가져오기
    CoroutineScope(Dispatchers.IO).launch {
        try {
            val apiKey = BuildConfig.WEATHER_API_KEY
            val url = "https://api.openweathermap.org/data/2.5/weather?lat=$lat&lon=$lon&appid=$apiKey&units=metric&lang=kr"

            val response = URL(url).readText()
            val json = JSONObject(response)

            val temp = json.getJSONObject("main").getDouble("temp").toInt()
            val description = json.getJSONArray("weather").getJSONObject(0).getString("description")
            val cityName = json.getString("name")

            CoroutineScope(Dispatchers.Main).launch {
                views.setTextViewText(R.id.widget_location, cityName)
                views.setTextViewText(R.id.widget_temperature, "${temp}°")
                views.setTextViewText(R.id.widget_description, description)
                views.setTextViewText(R.id.widget_update_time, getCurrentTime())
                appWidgetManager.updateAppWidget(appWidgetId, views)
            }
        } catch (e: Exception) {
            CoroutineScope(Dispatchers.Main).launch {
                views.setTextViewText(R.id.widget_temperature, "--°")
                views.setTextViewText(R.id.widget_description, "업데이트 실패")
                appWidgetManager.updateAppWidget(appWidgetId, views)
            }
        }
    }

    views.setTextViewText(R.id.widget_temperature, "...°")
    appWidgetManager.updateAppWidget(appWidgetId, views)
}

private fun getCurrentTime(): String {
    val sdf = SimpleDateFormat("HH:mm", Locale.getDefault())
    return sdf.format(Date())
}
