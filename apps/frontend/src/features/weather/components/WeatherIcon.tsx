import React from 'react';
import {
  Sun,
  Moon,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudDrizzle,
  CloudLightning,
  CloudFog,
  CloudSun,
  CloudMoon,
} from 'lucide-react';

interface WeatherIconProps {
  iconCode: string;
  size?: number;
  className?: string;
}

export const WeatherIcon = React.memo(function WeatherIcon({
  iconCode,
  size = 48,
  className = ''
}: WeatherIconProps) {
  const getIcon = () => {
    const code = iconCode.slice(0, 2);
    const isDay = iconCode.endsWith('d');

    const iconProps = {
      size,
      className: `${className} drop-shadow-lg`,
      strokeWidth: 1.5,
    };

    switch (code) {
      case '01':
        return isDay ? <Sun {...iconProps} /> : <Moon {...iconProps} />;
      case '02':
        return isDay ? <CloudSun {...iconProps} /> : <CloudMoon {...iconProps} />;
      case '03':
      case '04':
        return <Cloud {...iconProps} />;
      case '09':
        return <CloudDrizzle {...iconProps} />;
      case '10':
        return <CloudRain {...iconProps} />;
      case '11':
        return <CloudLightning {...iconProps} />;
      case '13':
        return <CloudSnow {...iconProps} />;
      case '50':
        return <CloudFog {...iconProps} />;
      default:
        return <Sun {...iconProps} />;
    }
  };

  return <div className="flex items-center justify-center">{getIcon()}</div>;
});
