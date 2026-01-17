/**
 * Section Config Repository
 * Handles resume section visibility and ordering
 */

import type { HttpClient } from "../client";

interface SectionUpdate {
 id: string;
 visible?: boolean;
 order?: number;
}

export function createSectionConfigRepository(client: HttpClient) {
 const configUrl = (resumeId: string) => `/v1/resumes/${resumeId}/config`;

 return {
  /**
   * Toggle section visibility
   */
  async toggleSection(resumeId: string, sectionId: string, visible: boolean) {
   return client.post(
    `${configUrl(resumeId)}/sections/${sectionId}/visibility`,
    {
     visible,
    }
   );
  },

  /**
   * Reorder section
   */
  async reorderSection(resumeId: string, sectionId: string, order: number) {
   return client.post(`${configUrl(resumeId)}/sections/${sectionId}/order`, {
    order,
   });
  },

  /**
   * Toggle item visibility within a section
   */
  async toggleItem(
   resumeId: string,
   sectionId: string,
   itemId: string,
   visible: boolean
  ) {
   return client.post(
    `${configUrl(resumeId)}/sections/${sectionId}/items/visibility`,
    {
     itemId,
     visible,
    }
   );
  },

  /**
   * Reorder item within a section
   */
  async reorderItem(
   resumeId: string,
   sectionId: string,
   itemId: string,
   order: number
  ) {
   return client.post(
    `${configUrl(resumeId)}/sections/${sectionId}/items/order`,
    {
     itemId,
     order,
    }
   );
  },

  /**
   * Batch update sections
   */
  async batchUpdate(resumeId: string, sections: SectionUpdate[]) {
   return client.post(`${configUrl(resumeId)}/sections/batch`, { sections });
  },
 };
}

export type SectionConfigRepository = ReturnType<
 typeof createSectionConfigRepository
>;
