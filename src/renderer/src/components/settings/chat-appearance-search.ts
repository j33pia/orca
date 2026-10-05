import { translate } from '@/i18n/i18n'
import { createLocalizedCatalog } from '@/i18n/localized-catalog'
import type { SettingsSearchEntry } from './settings-search'
import { isMacPlatform } from '../native-chat/native-chat-shortcut'

export const getChatContrastSearchEntries = createLocalizedCatalog((): SettingsSearchEntry[] => [
  {
    title: translate('settings.appearance.chat.matchTerminalInterface', 'Match terminal interface'),
    description: translate(
      'settings.appearance.chat.matchTerminalInterfaceDescription',
      "Use your terminal interface's font and colors for the whole chat. Stays in sync if you change your terminal theme later."
    ),
    targetSectionId: 'chat-match-terminal-interface'
  },
  {
    title: translate('settings.appearance.chat.contrast', 'Contrast'),
    description: translate(
      'settings.appearance.chat.contrastDescription',
      'How bright chat text is against the background. The right end matches the older, brighter look.'
    ),
    targetSectionId: 'chat-contrast'
  }
])

export const getChatAppearanceEntriesByKey = createLocalizedCatalog(
  () =>
    ({
      textSize: {
        targetSectionId: 'chat-text-size',
        title: translate('settings.appearance.chat.textSize', 'Text size'),
        description: translate(
          'settings.appearance.chat.textSizeDescription',
          'Messages, tool activity and the message box. {{increase}} / {{decrease}} in a chat change this too.',
          {
            increase: isMacPlatform() ? '⌘+' : 'Ctrl++',
            decrease: isMacPlatform() ? '⌘−' : 'Ctrl+−'
          }
        ),
        keywords: [translate('settings.appearance.chat.title', 'Chat')]
      },
      codeTextSize: {
        targetSectionId: 'chat-code-text-size',
        title: translate('settings.appearance.chat.codeTextSize', 'Code text size'),
        description: translate(
          'settings.appearance.chat.codeTextSizeDescription',
          'Code blocks, inline code, commands and tool output.'
        ),
        keywords: [translate('settings.appearance.chat.title', 'Chat')]
      },
      width: {
        targetSectionId: 'chat-width',
        title: translate('settings.appearance.chat.width', 'Width'),
        description: translate(
          'settings.appearance.chat.widthDescription',
          'How wide messages and the message box can grow in a wide pane.'
        ),
        keywords: [
          translate('settings.appearance.chat.title', 'Chat'),
          ...getChatWidthOptions().map((option) => option.label)
        ]
      },
      reset: {
        targetSectionId: 'chat-reset',
        title: translate('settings.appearance.chat.resetAppearance', 'Reset chat appearance'),
        description: translate(
          'settings.appearance.chat.resetDescription',
          'Restore the defaults above.'
        )
      }
    }) satisfies Record<string, SettingsSearchEntry>
)

export function getChatAppearanceSearchEntries(): SettingsSearchEntry[] {
  return [
    {
      title: translate('auto.components.settings.Settings.2b4474780a', 'Appearance'),
      targetSectionId: 'chat-appearance'
    },
    {
      title: translate('settings.appearance.chat.preview', 'Preview'),
      targetSectionId: 'chat-preview'
    },
    ...getChatContrastSearchEntries(),
    ...Object.values(getChatAppearanceEntriesByKey())
  ]
}

export function getChatWidthOptions() {
  return [
    {
      value: 'comfortable',
      label: translate('settings.appearance.chat.comfortable', 'Comfortable')
    },
    { value: 'wide', label: translate('settings.appearance.chat.wide', 'Wide') },
    { value: 'full', label: translate('settings.appearance.chat.full', 'Full') }
  ] as const
}
