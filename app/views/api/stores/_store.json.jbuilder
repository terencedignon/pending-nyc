json.extract!(store, :image_url, :cuisine_type, :building, :street, :name, :phone, :camis, :id, :lat, :lng, :calc, :display_address, :boro, :zipcode)
# json.partial!('api/calcs/calc', calc: store.calc)

unless index

  json.zipcode_ranking store.zipcode_ranking
  json.boro_ranking store.boro_ranking
  json.cuisine_ranking store.cuisine_ranking

  json.extract!(store, :image_url, :camis, :lat, :yelp_url, :neighborhoods, :display_address, :snippet_text, :display_phone, :zipcode, :lng, :cuisine_type, :visit_count, :last_visit, :phone, :boro, :street, :boro_calc, :cuisine_calc, :zipcode_calc, :building)
  json.inspections store.inspections.each do |inspection|
    json.partial!('api/inspections/inspection', inspection: inspection)
  end
end
