# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)


require 'open-uri'
require 'JSON'
offset = 0

while offset < 500_0000
	data = open('https://data.cityofnewyork.us/resource/xx67-kt59.json?$limit=50000&$offset=' + offset.to_s)
  JSON.load(data).each_with_index do |item, index|
    store = Store.find_by_camis(item["camis"])
		puts index if index % 1000 == 0
    if store.nil?
      store = Store.create(
      name: item["dba"].strip,
      phone: item["phone"],
      building: item["building"] ? item["building"].strip : nil,
      camis: item["camis"],
      zipcode: item["zipcode"],
      boro: item["boro"],
      cuisine_type: item["cuisine_description"],
      street: item["street"]
      )
    end

    inspection = Inspection.find_by_inspection_date_and_store_id(item["inspection_date"].to_datetime, store.id)

    if inspection.nil?
      inspection = Store.find_by_camis(item["camis"]).inspections.create(
        inspection_date: item["inspection_date"],
        record_date: item["record_date"],
        action: item["action"],
				grade: item["grade"] || "Z",
        score: item["score"],
        grade_date: item["grade_date"],
        inspection_type: item["inspection_type"]
      )
    end

    Violation.create(
      description: item["violation_description"],
      inspection_id: inspection.id,
      code: item["violation_code"],
      critical: item["critical_flag"] == "Critical" ? true : false
    )
  end
	puts offset
  offset += 50000
end
