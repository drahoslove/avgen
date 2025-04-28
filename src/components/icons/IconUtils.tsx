import React from 'react'

export const wrapSocialIcon = (Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>) =>
  React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>((props, ref) => (
    <Icon {...props} ref={ref} className={`${props.className || ''} flex-shrink-0`} />
  ))
