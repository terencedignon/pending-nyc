json.extract!(store, :name, :id)


unless index
  json.extract!(store, :camis, :cuisine_type, :phone, :boro, :street, :building)
  json.partial!('api/calcs/calc', calc: store.calc)
  json.inspections store.inspections.each do |inspection|
    json.partial!('api/inspections/inspection', inspection: inspection)
  end
end
