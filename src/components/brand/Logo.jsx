import React from 'react';
import { Image } from '@/components/ui/image';

const LOGO_URL =
  'https://media.base44.com/images/public/6ab873f17099f59b4f7908e9/376eca647_ChatGPTImageSep26202610_14_06PM.png';

export const LOGO_IMAGE_URL = LOGO_URL;

export default function Logo({ className = '', imgClassName = '' }) {
  return (
    <div className={`flex items-center ${className}`}>
      <Image
        src={LOGO_URL}
        alt="Maple Grow"
        fittingType="fit"
        className={`h-10 w-auto ${imgClassName}`}
      />
    </div>
  );
}