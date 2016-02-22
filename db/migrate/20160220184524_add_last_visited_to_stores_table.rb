class AddLastVisitedToStoresTable < ActiveRecord::Migration
  def change
    add_column :stores, :last_visit, :datetime
    add_column :stores, :visit_count, :integer, default: 0
  end
end
