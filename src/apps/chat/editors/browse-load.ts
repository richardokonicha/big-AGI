import { callBrowseFetchPage } from '~/modules/browse/browse.client';

import { conversationManager } from '~/common/chats/ConversationManager';


export const runBrowseGetPageUpdatingState = async (conversationId: string, url: string) => {
  const cHandler = conversationManager().getHandler(conversationId, 'runBrowseUpdatingState');

  // noinspection HttpUrlsUsage
  const shortUrl = url.replace('https://www.', '').replace('https://', '').replace('http://', '').replace('www.', '');
  const assistantMessageId = cHandler.messageAppendAssistant(`Loading page at ${shortUrl}...`, 'web', undefined);

  try {
    const page = await callBrowseFetchPage(url);
    cHandler.messageEdit(assistantMessageId, { text: page.content || 'Issue: page load did not produce an answer: no text found', typing: false }, true);
  } catch (error: any) {
    console.error(error);
    cHandler.messageEdit(assistantMessageId, { text: 'Issue: browse did not produce an answer (error: ' + (error?.message || error?.toString() || 'unknown') + ').', typing: false }, true);
  }

  conversationManager().releaseHandler(cHandler, 'runBrowseUpdatingState');
};