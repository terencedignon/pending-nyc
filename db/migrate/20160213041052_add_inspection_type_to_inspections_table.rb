class AddInspectionTypeToInspectionsTable < ActiveRecord::Migration
  def change
    add_column :inspections, :inspection_type, :string, default: ""
  end
end
