import type { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(
    props: ImgHTMLAttributes<HTMLImageElement>,
) {
    return (
        <img
            {...props}
            src="/images/sigelab-logo.png"
            alt="Logo de SIGELAB"
            className={`object-contain ${props.className ?? ''}`}
        />
    );
}
