json.extract!(inspection, :inspection_date, :inspection_type, :action, :score, :grade, :grade_date, :record_date)

json.violations inspection.violations.each do |violation|
  json.partial!('api/violations/violation', violation: violation)
end
