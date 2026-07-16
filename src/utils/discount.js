export const isDiscountActive = (item) => {
  const discountType = item?.discountType || (Number(item?.discountPercentage) > 0 ? 'percent' : 'none')
  const discountValue = Number(item?.discountValue ?? item?.discountPercentage ?? 0) || 0

  if (discountType === 'none' || discountValue <= 0) {
    return false
  }

  if (!item?.discountEndsAt) {
    return true
  }

  let expiryDate;
  if (item.discountEndsAt.includes('T') || item.discountEndsAt.includes(':')) {
    expiryDate = new Date(item.discountEndsAt)
  } else {
    expiryDate = new Date(`${item.discountEndsAt}T23:59:59`)
  }

  if (Number.isNaN(expiryDate.getTime())) {
    return true
  }

  return expiryDate >= new Date()
}

export const getDiscountedPrice = (item) => {
  const price = Number(item?.price ?? 0) || 0
  if (price <= 0 || !isDiscountActive(item)) {
    return price
  }

  const discountType = item?.discountType || (Number(item?.discountPercentage) > 0 ? 'percent' : 'none')
  const discountValue = Number(item?.discountValue ?? item?.discountPercentage ?? 0) || 0

  if (discountType === 'percent' && discountValue > 0) {
    return Math.max(price - (price * discountValue / 100), 0)
  }

  if (discountType === 'amount' && discountValue > 0) {
    return Math.max(price - discountValue, 0)
  }

  return price
}

export const hasDiscount = (item) => {
  const price = Number(item?.price ?? 0) || 0
  if (price <= 0) {
    return false
  }

  const discountedPrice = getDiscountedPrice(item)
  return discountedPrice < price
}

export const getDiscountLabel = (item) => {
  if (!isDiscountActive(item)) {
    return ''
  }

  const discountType = item?.discountType || (Number(item?.discountPercentage) > 0 ? 'percent' : 'none')
  const discountValue = Number(item?.discountValue ?? item?.discountPercentage ?? 0) || 0

  if (discountType === 'percent' && discountValue > 0) {
    return `%${Math.round(discountValue)} İndirim`
  }

  if (discountType === 'amount' && discountValue > 0) {
    return `${discountValue.toFixed(2)} TL İndirim`
  }

  return ''
}
