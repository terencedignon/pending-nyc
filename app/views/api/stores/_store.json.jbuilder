json.extract!(store, :name, :camis, :id, :lat, :lng, :calc, :boro, :zipcode)
# json.partial!('api/calcs/calc', calc: store.calc)

unless index
  json.extract!(store, :camis, :lat, :zipcode, :lng, :cuisine_type, :phone, :boro, :street, :boro_calc, :cuisine_calc, :zipcode_calc, :building)
  json.inspections store.inspections.each do |inspection|
    json.partial!('api/inspections/inspection', inspection: inspection)
  end
end
