'use client';

import React, { useState } from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';
import GlobalStyles from '@/config/GlobalStyles';

export default function StyledComponentsRegistry({ children }: { children: React.ReactNode }) {
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet());

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement();
    styledComponentsStyleSheet.instance.clearTag();
    return <>{styles}</>;
  });

  const props = { shouldForwardProp: (prop: string) => !prop.startsWith('$') };

  if (typeof window !== 'undefined') {
    return (
      <StyleSheetManager {...props}>
        <GlobalStyles />
        {children}
      </StyleSheetManager>
    );
  }

  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance} {...props}>
      <GlobalStyles />
      {children}
    </StyleSheetManager>
  );
}
