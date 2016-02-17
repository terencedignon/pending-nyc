json.array!(violations) do |violation|
  
  json.partial!('violation', violation: violation)
end
