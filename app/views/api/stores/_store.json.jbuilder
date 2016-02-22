json.extract!(store, :image_url, :name, :camis, :id, :lat, :lng, :calc, :boro, :zipcode)
# json.partial!('api/calcs/calc', calc: store.calc)

unless index
  json.extract!(store, :camis, :lat, :yelp_url, :neighborhoods, :display_address, :snippet_text, :display_phone, :zipcode, :lng, :cuisine_type, :visit_count, :last_visit, :phone, :boro, :street, :boro_calc, :cuisine_calc, :zipcode_calc, :building)
  json.inspections store.inspections.each do |inspection|
    json.partial!('api/inspections/inspection', inspection: inspection)
  end
end
