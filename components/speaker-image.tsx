'use client';

import { useState } from 'react';
import Image from 'next/image';

interface SpeakerImageProps {
    src: string;
    alt: string;
}

export default function SpeakerImage({ src, alt }: SpeakerImageProps) {
    const [imgSrc, setImgSrc] = useState(src);

    const handleError = () => {
        setImgSrc('/placeholder-user.jpg');
    };

    return (
        <Image
            src={imgSrc}
            alt={alt}
            fill
            className="object-cover"
            onError={handleError}
        />
    );
}