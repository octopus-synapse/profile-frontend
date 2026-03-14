/**
 * AST Section Component
 *
 * Renders a section from the resume AST.
 * ALL section types are now rendered by GenericSectionRenderer.
 * Backend provides semanticKind which determines rendering style.
 */

'use client';

import type { PlacedSectionDto } from '@profile/api-client';
import { GenericSectionRenderer } from './generic';

interface Props {
  section: PlacedSectionDto;
}

export function ASTSection({ section }: Props) {
  const { styles } = section;

  const containerStyle = {
    backgroundColor: styles.container.backgroundColor,
    borderColor: styles.container.borderColor,
    borderWidth: `${styles.container.borderWidthPx}px`,
    borderRadius: `${styles.container.borderRadiusPx}px`,
    padding: `${styles.container.paddingPx}px`,
    marginBottom: `${styles.container.marginBottomPx}px`,
  };

  return (
    <div style={containerStyle}>
      <GenericSectionRenderer section={section} />
    </div>
  );
}
