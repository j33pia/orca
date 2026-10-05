// @vitest-environment happy-dom
import { useRef } from 'react'
import { act, cleanup, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import * as terminalThemeSelection from '../../../../shared/terminal-theme-selection'
import { createGlobalSettingsFixture } from '../../../../shared/global-settings-test-fixture'
import { useAppStore } from '../../store'
import { resetSystemPrefersDarkSubscriptionForTests } from '../terminal-pane/use-system-prefers-dark'
import { useNativeChatRowTypography } from './use-native-chat-row-typography'

const originalSettings = useAppStore.getState().settings

afterEach(() => {
  cleanup()
  useAppStore.setState({ settings: originalSettings })
  resetSystemPrefersDarkSubscriptionForTests()
  vi.restoreAllMocks()
})

describe('memoized transcript row typography', () => {
  it('does no theme work on message renders or unrelated settings writes and follows text size and measured width', () => {
    const settings = createGlobalSettingsFixture({
      theme: 'dark',
      nativeChatAppearance: { matchTerminalInterface: true }
    })
    useAppStore.setState({ settings })
    const resolveColors = vi.spyOn(terminalThemeSelection, 'resolveConfiguredTerminalColors')
    const matchMedia = vi.spyOn(window, 'matchMedia')
    const rendered = vi.fn()
    const { result, rerender } = renderHook(() => {
      rendered()
      return useNativeChatRowTypography(useRef<HTMLDivElement>(null))
    })
    const initial = result.current.typography
    expect(resolveColors).toHaveBeenCalledTimes(1)
    const initialMediaReads = matchMedia.mock.calls.length
    rerender()
    rerender()
    expect(result.current.typography).toBe(initial)
    expect(resolveColors).toHaveBeenCalledTimes(1)
    expect(matchMedia).toHaveBeenCalledTimes(initialMediaReads)
    const renders = rendered.mock.calls.length
    act(() =>
      useAppStore.setState({
        settings: { ...settings, terminalFontSize: settings.terminalFontSize + 1 }
      })
    )
    expect(rendered).toHaveBeenCalledTimes(renders)
    expect(resolveColors).toHaveBeenCalledTimes(1)
    act(() =>
      useAppStore.setState({
        settings: {
          ...settings,
          nativeChatAppearance: { matchTerminalInterface: true, fontSize: 20 }
        }
      })
    )
    expect(result.current.typography.lineHeightPx).toBe((22 * 20) / 14)
    expect(resolveColors).toHaveBeenCalledTimes(2)
    const node = document.createElement('div')
    vi.spyOn(node, 'getBoundingClientRect').mockReturnValue(DOMRect.fromRect({ width: 368 }))
    act(() => result.current.measureContent(node))
    expect(result.current.typography.charsPerLine).toBe((48 * 14) / 20)
    expect(resolveColors).toHaveBeenCalledTimes(3)
    act(() => result.current.measureContent(null))
  })
})
