# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class TabelogItem(scrapy.Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    pass

class RestaurantItem(scrapy.Item):
    restaurant_id = scrapy.Field()
    subarea_id = scrapy.Field()
    area_id = scrapy.Field()
    address = scrapy.Field()
    name = scrapy.Field()
    avg_rating = scrapy.Field()

class ReviewItem(scrapy.Item):
    restaurant_id = scrapy.Field()
    user_id = scrapy.Field()
    rating = scrapy.Field()
    review = scrapy.Field()