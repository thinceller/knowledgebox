import React from 'react'
import MCard from '@material-ui/core/Card'

type CardProps = {
  title: string
}

export const Card: React.FC<CardProps> = ({ title }) => <MCard>{title}</MCard>
