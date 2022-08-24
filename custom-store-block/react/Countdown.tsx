/* eslint-disable prettier/prettier */
/* eslint-disable no-empty-pattern */
/* eslint-disable @typescript-eslint/no-empty-interface */
import React, { useState } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { useQuery } from 'react-apollo'
import useProduct from 'vtex.product-context/useProduct'

import { tick, getTwoDaysFromNow } from './utils/time'
import { TimeSplit } from './typings/global'
import productReleaseDate from './graphql/productReleaseDate.graphql'

interface CountdownProps { }

const CSS_HANDLES = ['container']
const DEFAULT_TARGET_DATE = getTwoDaysFromNow()

const Countdown: StorefrontFunctionComponent<CountdownProps> = ({ }) => {
  const [timeRemaining, setTime] = useState<TimeSplit>({
    hours: '00',
    minutes: '00',
    seconds: '00',
  })

  const handles = useCssHandles(CSS_HANDLES)

  const product = useProduct()

  const { data, loading, error } = useQuery(productReleaseDate, {
    variables: {
      slug: product?.linkText,
    },
    ssr: false,
  })
  tick(data?.product?.releaseDate || DEFAULT_TARGET_DATE, setTime)

  if (!product) {
    return (
      <div>
        <span>There is no product context.</span>
      </div>
    )
  }

  if (loading) {
    return (
      <div>
        <span>Loading...</span>
      </div>
    )
  }
  if (error) {
    return (
      <div>
        <span>Erro!</span>
      </div>
    )
  }

  return (
    <div className={`${handles.countdown} db tc`}>
      {`${timeRemaining.hours}:${timeRemaining.minutes}:${timeRemaining.seconds}`}
    </div>
  )
}

Countdown.schema = {
  title: 'editor.countdown.title',
  description: 'editor.countdown.description',
  type: 'object',
  properties: {},
}

export default Countdown
