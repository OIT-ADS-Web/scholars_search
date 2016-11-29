
// NOTE: designed for centralizing search : { searchFields } access  
export function defaultTab(searchFields) {
  let filter = searchFields ? (searchFields['filter'] || 'person') : 'person'
  return filter
}

export function defaultChosenFacets(searchFields) {
  let chosen_ids = searchFields['facetIds'] ? searchFields['facetIds'] : []
    
  // have to convert to array if it's a single value. 
  // FIXME: there is probably a better way to do this
  if (typeof chosen_ids === 'string') {
    chosen_ids = [chosen_ids]
  }
  return chosen_ids
}


export default { defaultTab, defaultChosenFacets }

