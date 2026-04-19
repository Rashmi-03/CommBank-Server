import { faCalendarAlt } from '@fortawesome/free-regular-svg-icons'
import { faDollarSign, IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
import 'date-fns'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { updateGoal as updateGoalApi } from '../../../api/lib'
import { Goal } from '../../../api/types'
import { selectGoalsMap, updateGoal as updateGoalRedux } from '../../../store/goalsSlice'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import DatePicker from '../../components/DatePicker'
import EmojiPicker from '../../components/EmojiPicker'
import { Theme } from '../../components/Theme'
import AddIconButton from './AddIconButton'
import GoalIcon from './GoalIcon'

type Props = { goal: Goal }

export function GoalManager(props: Props) {
  const dispatch = useAppDispatch()
  const goal = useAppSelector(selectGoalsMap)[props.goal.id] ?? props.goal

  const [name, setName] = useState<string>('')
  const [targetDate, setTargetDate] = useState<Date | null>(null)
  const [targetAmount, setTargetAmount] = useState<string>('')
  const [icon, setIcon] = useState<string | null>(null)
  const [showPicker, setShowPicker] = useState(false)

  useEffect(() => {
    setName(goal.name ?? '')
    setTargetDate(goal.targetDate ?? null)
    setTargetAmount(
      goal.targetAmount !== undefined && goal.targetAmount !== null
        ? String(goal.targetAmount)
        : ''
    )
    setIcon(goal.icon ?? null)
  }, [goal])

  const saveGoal = async (updatedGoal: Goal) => {
    dispatch(updateGoalRedux(updatedGoal))
    const ok = await updateGoalApi(updatedGoal.id, updatedGoal)
    if (!ok) {
      console.error('Failed to update goal')
    }
  }

  const updateNameOnBlur = async () => {
    const updatedGoal: Goal = {
      ...goal,
      name: name.trim() || goal.name,
      targetDate: targetDate ?? goal.targetDate,
      targetAmount: Number(targetAmount) || 0,
      icon: icon ?? undefined,
    }
    await saveGoal(updatedGoal)
  }

  const updateTargetAmountOnBlur = async () => {
    const updatedGoal: Goal = {
      ...goal,
      name: name.trim() || goal.name,
      targetDate: targetDate ?? goal.targetDate,
      targetAmount: Number(targetAmount) || 0,
      icon: icon ?? undefined,
    }
    await saveGoal(updatedGoal)
  }

  const pickDateOnChange = async (date: MaterialUiPickersDate) => {
    if (date != null) {
      const nextDate = date as Date
      setTargetDate(nextDate)

      const updatedGoal: Goal = {
        ...goal,
        name: name.trim() || goal.name,
        targetDate: nextDate,
        targetAmount: Number(targetAmount) || goal.targetAmount,
        icon: icon ?? undefined,
      }

      await saveGoal(updatedGoal)
    }
  }

  const pickEmojiOnClick = async (emoji: any, _event: React.MouseEvent) => {
    const nextIcon = emoji.native ?? goal.icon ?? null
    setIcon(nextIcon)

    const updatedGoal: Goal = {
      ...goal,
      name: name.trim() || goal.name,
      targetDate: targetDate ?? goal.targetDate,
      targetAmount: Number(targetAmount) || goal.targetAmount,
      icon: nextIcon ?? undefined,
    }

    await saveGoal(updatedGoal)
    setShowPicker(false)
  }

  return (
    <GoalManagerContainer>
      <NameInput
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={updateNameOnBlur}
        placeholder="Goal name"
      />

      <IconSection>
        <AddIconButton
          hasIcon={!!icon}
          onClick={() => setShowPicker(!showPicker)}
        />
        {!!icon && (
          <GoalIcon icon={icon} onClick={() => setShowPicker(!showPicker)} />
        )}
        {showPicker && (
          <EmojiPickerContainer>
            <EmojiPicker onClick={pickEmojiOnClick} />
          </EmojiPickerContainer>
        )}
      </IconSection>

      <Group>
        <Field name="Target Date" icon={faCalendarAlt} />
        <Value>
          <DatePicker value={targetDate} onChange={pickDateOnChange} />
        </Value>
      </Group>

      <Group>
        <Field name="Target Amount" icon={faDollarSign} />
        <Value>
          <StringInput
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            onBlur={updateTargetAmountOnBlur}
          />
        </Value>
      </Group>

      <Group>
        <Field name="Balance" icon={faDollarSign} />
        <Value>
          <StringValue>{goal.balance}</StringValue>
        </Value>
      </Group>

      <Group>
        <Field name="Date Created" icon={faCalendarAlt} />
        <Value>
          <StringValue>{new Date(goal.created).toLocaleDateString()}</StringValue>
        </Value>
      </Group>
    </GoalManagerContainer>
  )
}

type FieldProps = { name: string; icon: IconDefinition }

const Field = (props: FieldProps) => (
  <FieldContainer>
    <FontAwesomeIcon icon={props.icon} size="2x" />
    <FieldName>{props.name}</FieldName>
  </FieldContainer>
)

const GoalManagerContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  height: 100%;
  width: 100%;
  position: relative;
`

const IconSection = styled.div`
  position: relative;
  margin: 1.25rem 0;
`

const EmojiPickerContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 20;
`

const Group = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-top: 1.25rem;
  margin-bottom: 1.25rem;
`

const NameInput = styled.input`
  display: flex;
  background-color: transparent;
  outline: none;
  border: none;
  font-size: 4rem;
  font-weight: bold;
  color: ${({ theme }: { theme: Theme }) => theme.text};
`

const FieldName = styled.h1`
  font-size: 1.8rem;
  margin-left: 1rem;
  color: rgba(174, 174, 174, 1);
  font-weight: normal;
`

const FieldContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 20rem;

  svg {
    color: rgba(174, 174, 174, 1);
  }
`

const StringValue = styled.h1`
  font-size: 1.8rem;
  font-weight: bold;
`

const StringInput = styled.input`
  display: flex;
  background-color: transparent;
  outline: none;
  border: none;
  font-size: 1.8rem;
  font-weight: bold;
  color: ${({ theme }: { theme: Theme }) => theme.text};
`

const Value = styled.div`
  margin-left: 2rem;
`

export default GoalManager