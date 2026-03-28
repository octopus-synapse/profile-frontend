export function selectEnvelopeData<TData>(response: { data: { data: TData } }): TData {
  return response.data.data;
}
