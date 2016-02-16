json.array!(@stores) do |store|
  json.partial!('store', store: store, index: true)
end
