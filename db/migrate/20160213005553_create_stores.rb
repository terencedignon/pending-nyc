class CreateStores < ActiveRecord::Migration
  def change
    create_table :stores do |t|
      t.string :building, default: ""
      t.string :name, default: ""
      t.integer :camis, null: false
      t.string :phone, default: ""
      t.integer :street, default: ""
      t.integer :zipcode, null: false
      t.string :boro
      t.string :cuisine_type, default: ""

      t.timestamps null: false
    end
  end
end
