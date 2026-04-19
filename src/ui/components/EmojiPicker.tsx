import React from 'react'

type Props = {
  onClick: (emoji: any, event: React.MouseEvent) => void
}

const emojis = ['🎯', '🏠', '🚗', '💰', '✈️', '🎓', '🛍️', '❤️']

export default function EmojiPicker(props: Props) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '0.8rem',
        padding: '1rem',
        background: '#fff',
        borderRadius: '1rem',
        boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
      }}
    >
      {emojis.map((emoji) => (
        <button
          key={emoji}
          type="button"
          onClick={(event) => props.onClick({ native: emoji }, event)}
          style={{
            fontSize: '2rem',
            padding: '0.5rem',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
          }}
        >
          {emoji}
        </button>
      ))}
    </div>
  )
}