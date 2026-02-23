'use client';

import React, { useState } from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';

const TRANSIENT_PROP_NAMES = /^\$/;

export default function StyledComponentsRegistry({ children }: { children: React.ReactNode }) {
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet());

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement();
    styledComponentsStyleSheet.instance.clearTag();
    return <>{styles}</>;
  });

  const sharedProps = {
    shouldForwardProp: (prop: string) => !TRANSIENT_PROP_NAMES.test(prop),
  };

  if (typeof window !== 'undefined') {
    return <StyleSheetManager {...sharedProps}>{children}</StyleSheetManager>;
  }

  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance} {...sharedProps}>
      {children}
    </StyleSheetManager>
  );
}
