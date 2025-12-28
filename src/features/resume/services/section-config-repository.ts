/**
 * Section Config Repository
 * API calls for section visibility and ordering
 */

import { httpClient } from "@/shared/lib/http-client";

const configUrl = (resumeId: string) => `/resumes/${resumeId}/config`;

export const sectionConfigRepository = {
  async toggleSection(resumeId: string, sectionId: string, visible: boolean) {
    return httpClient.post(`${configUrl(resumeId)}/sections/${sectionId}/visibility`, { visible });
  },

  async reorderSection(resumeId: string, sectionId: string, order: number) {
    return httpClient.post(`${configUrl(resumeId)}/sections/${sectionId}/order`, { order });
  },

  async toggleItem(resumeId: string, sectionId: string, itemId: string, visible: boolean) {
    return httpClient.post(`${configUrl(resumeId)}/sections/${sectionId}/items/visibility`, {
      itemId,
      visible,
    });
  },

  async reorderItem(resumeId: string, sectionId: string, itemId: string, order: number) {
    return httpClient.post(`${configUrl(resumeId)}/sections/${sectionId}/items/order`, {
      itemId,
      order,
    });
  },

  async batchUpdate(
    resumeId: string,
    sections: Array<{ id: string; visible?: boolean; order?: number }>
  ) {
    return httpClient.post(`${configUrl(resumeId)}/sections/batch`, { sections });
  },
};
