# -*- coding: utf-8 -*-

# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html
import json
from tabelog.items import RestaurantItem, ReviewItem
from scrapy.exporters import JsonItemExporter

# class TabelogPipeline(object):
#     def process_item(self, item, spider):
#         return item

class JsonWriterPipeline(object):

    def open_spider(self, spider):
        self.restaurants_file = open('restaurant.json', 'wb')
        self.reviews_file = open('reviews.json', 'wb')

        self.restaurants_exporter = JsonItemExporter(self.restaurants_file, encoding='utf-8', ensure_ascii=False, indent=4)
        self.restaurants_exporter.start_exporting()

        # self.reviews_exporter = JsonItemExporter(self.reviews_file, encoding='utf-8', ensure_ascii=False, indent=4)
        # self.reviews_exporter.start_exporting()

    def close_spider(self, spider):
        self.restaurants_exporter.finish_exporting()
        # self.reviews_exporter.finish_exporting()

        self.restaurants_file.close()
        # self.reviews_file.close()
    
    def process_item(self, item, spider):
        if isinstance(item, RestaurantItem):
            self.restaurants_exporter.export_item(item)
        else:
            self.reviews_exporter.export_item(item)

        return item
