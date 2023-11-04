import numeral from 'numeral'

export const parsePrice = (
  price: string | number,
  sendNumber?: boolean,
  asString?: boolean
) => {
  const stripedPrice = String(price)
    .replace(/\.$/, '.00')
    .replace(/\.\.+/g, '.')
    .replace(/[^0-9\.]/g, '')
  const decimalFormat = Number(Number(stripedPrice || 0).toFixed(2))
  const numberAsString = numeral(decimalFormat).format('0,0.00')
  const currencyFormat = `$${numberAsString}`
  return sendNumber
    ? asString
      ? numberAsString
      : decimalFormat
    : currencyFormat
}

export const formatPrice = (price: string) => {
  let [beforeDecimal, afterDecimal] = price.split('.')

  if (typeof afterDecimal === 'string') {
    afterDecimal = afterDecimal.slice(0, Math.min(afterDecimal.length, 2))

    return [beforeDecimal, afterDecimal].join('.')
  } else {
    return beforeDecimal
  }
}
