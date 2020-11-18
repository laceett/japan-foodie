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
    rating = scrapy.Field()
    dinner_start_price = scrapy.Field()
    dinner_max_price = scrapy.Field()
    lunch_start_price = scrapy.Field()
    lunch_max_price = scrapy.Field()

class BusinessHourItem(scrapy.Item):
    category = scrapy.Field()
    start_hour_1 = scrapy.Field()
    end_hour_1 = scrapy.Field()
    start_hour_2 = scrapy.Field()
    end_hour_2 = scrapy.Field()
    start_hour_3 = scrapy.Field()
    end_hour_3 = scrapy.Field()
    start_hour_4 = scrapy.Field()
    end_hour_4= scrapy.Field()
    start_hour_5 = scrapy.Field()
    end_hour_5 = scrapy.Field()
    start_hour_6 = scrapy.Field()
    end_hour_6 = scrapy.Field()


    # restaurant_id = scrapy.Field()
    # subarea_id = scrapy.Field()
    # area_id = scrapy.Field()
    # address = scrapy.Field()
    # name = scrapy.Field()
    # avg_rating = scrapy.Field()

class ReviewItem(scrapy.Item):
    restaurant_id = scrapy.Field()
    user_id = scrapy.Field()
    rating = scrapy.Field()
    review = scrapy.Field()

class BusinessItem(scrapy.Item):
    business_id = scrapy.Field()
    name = scrapy.Field()
    categories = scrapy.Field()
    stars = scrapy.Field()
    stars_dinner = scrapy.Field()
    stars_lunch = scrapy.Field()
    review_count = scrapy.Field()
    prefecture = scrapy.Field()
    area = scrapy.Field()
    subarea = scrapy.Field()
    price_dinner = scrapy.Field()
    price_lunch = scrapy.Field()
    menu_items = scrapy.Field()