json.extract!(store, :name, :camis, :id, :lat, :lng)
json.partial!('api/calcs/calc', calc: store.calc)

unless index
  json.extract!(store, :camis, :lat, :lng, :cuisine_type, :phone, :boro, :street, :building)
  json.inspections store.inspections.each do |inspection|
    json.partial!('api/inspections/inspection', inspection: inspection)
  end
end
