import { Children, cloneElement, ReactElement, ReactNode } from 'react'
import { styled } from './theme'
import { Text } from './Text'
import { Button } from './Button'
import { IconWrapper } from './IconWrapper'
import { Union } from '../icons/Union'

type ToastProps = {
  icon: ReactElement
  title: ReactNode
  body?: ReactNode
  buttons?: ReactNode
  onClose: () => void
}

export const Toast = ({ title, body, buttons, onClose, icon }: ToastProps) => {
  return (
    <StyledToast>
      {icon &&
        cloneElement(Children.only(icon), {
          size: '24px',
        })}
      <StyledBodyContent>
        <Text variant="primary" color="white">
          {title}
        </Text>
        {body && (
          <Text variant="secondary" color="white" css={{ paddingTop: '$2' }}>
            {body}
          </Text>
        )}
        {buttons && <StyledDivForButtons>{buttons}</StyledDivForButtons>}
      </StyledBodyContent>
      <StyledButtonForCloseButton
        variant="ghost"
        icon={<IconWrapper icon={<Union />} />}
        onClick={onClose}
      />
    </StyledToast>
  )
}

const StyledToast = styled('div', {
  display: 'flex',
  position: 'relative',
  backgroundColor: '$dark',
  boxShadow: '0px 4px 10px 0px $colors$dark15, 0 0 0 1px $colors$dark20',
  padding: '$8 $7',
  columnGap: '$space$2',
  borderRadius: '$1',
  width: '22rem',
})

const StyledBodyContent = styled('div', {
  paddingRight: 'calc(24px + $space$4)',
})

const StyledButtonForCloseButton = styled(Button, {
  position: 'absolute',
  right: '$space$4',
  top: '$space$4',
  '& svg': { color: '$white50' },
})

const StyledDivForButtons = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  columnGap: '$space$2',
  paddingTop: '$5',
})
