import scrapy
from scrapy.linkextractors import LinkExtractor
from scrapy.http.request import Request
from scrapy.spiders import CrawlSpider, Rule
# from googletrans import Translator
import re

from tabelog.items import RestaurantItem, ReviewItem, BusinessHourItem

class RamenSpider(scrapy.Spider):
    name = "business_hours"
    allowed_domains = ["tabelog.com"]
    pagesToCrawl = 10

    prefectures = [
        'hokkaido',
        'aomori',
        'iwate',
        'miyagi',
        'akita',
        'yamagata',
        'fukushima',
        'ibaraki',
        'tochigi',
        'gunma',
        'saitama',
        'chiba',
        'tokyo',
        'kanagawa',
        'niigata',
        'toyama',
        'ishikawa',
        'fukui',
        'yamanashi',
        'nagano',
        'gifu',
        'shizuoka',
        'aichi',
        'mie',
        'shiga',
        'kyoto',
        'osaka',
        'hyogo',
        'nara',
        'wakayama',
        'tottori',
        'shimane',
        'okayama',
        'hiroshima',
        'yamaguchi',
        'tokushima',
        'kagawa',
        'ehime',
        'kochi',
        'fukuoka',
        'saga',
        'nagasaki',
        'kumamoto',
        'oita',
        'miyazaki',
        'kagoshima',
        'okinawa',
    ]
    category = 'izakaya'
# 'https://tabelog.com/rstLst/sushi/' + str(i) for i in range(1,pagesToCrawl)
    start_urls = [
    
        'http://tabelog.com/{0}/rstLst/izakaya/{1}'.format(prefecture, page)
        for prefecture in prefectures for page in range(1, 60)
    ]
    
    # # In [26]: LinkExtractor(allow=[r"tokyo/A.*/.*/.*/dtlrvwlst/"], deny=[r"rstLst/.*",r"ramen/.*",r"dtlrvwlst/\?",r"dtlrvwlst/[A-Z]"]).extract_links(response)
    # rules = [
    # #     # Rule(LinkExtractor(allow=[r"tokyo/A.*/.*/.*/"], deny=[r"rstLst/.*",r"dtlrvwlst/.*",r"ramen/.*"]), callback="parse_item", follow=True),
    #     # Rule(LinkExtractor(allow=[r"tokyo/A.*/.*/.*/dtlrvwlst/"], deny=[r"rstLst/.*",r"ramen/.*",r"dtlrvwlst/\?",r"dtlrvwlst/[A-Z]"]), callback="parse_restaurant"),
    # #     # Rule(LinkExtractor(allow=[r"tokyo/A.*/.*/.*/dtlrvwlst/B.*"], deny=[r"rstLst/.*",r"ramen/.*",r"dtlrvwlst/\?"]), callback="parse_review"),
    #             Rule(LinkExtractor(allow=[r"rstLst/ramen/"]), callback="parse_restaurant", follow=False)
    #         ]
    
    def parse(self, response):

        self.logger.info('Crawling restaurant at: %s', response.url)


        self.logger.info('Crawling restaurant at: %s', response.url)

        restaurant_url_list = response.xpath("//div[contains(@class, 'js-rst-cassette-wrap')]/@data-detail-url").extract()

        for url in restaurant_url_list:
            yield scrapy.Request(url, callback=self.parse_business_hours)

        
        # restaurant = RestaurantItem()

        # ratingsList = response.xpath('.//span[@class="c-rating__val c-rating__val--strong list-rst__rating-val"]/text()').extract()
        # dinnerPriceList = response.xpath('.//span[@class="c-rating__val list-rst__budget-val cpy-dinner-budget-val"]/text()').extract()
        # lunchPriceList = response.xpath('.//span[@class="c-rating__val list-rst__budget-val cpy-lunch-budget-val"]/text()').extract()
        

        # print(ratingsList)
        # print(dinnerPriceList)


        # for i in range(len(ratingsList)):
        #     restaurant['rating'] = ratingsList[i]
        #     restaurant['dinner_start_price'] = self._process_price(dinnerPriceList[i])[0]
        #     restaurant['dinner_max_price'] = self._process_price(dinnerPriceList[i])[1]
        #     restaurant['lunch_start_price'] = self._process_price(lunchPriceList[i])[0]
        #     restaurant['lunch_max_price'] = self._process_price(lunchPriceList[i])[1]
            
        #     yield restaurant

    def _process_price(self, price_str):
        if price_str == '-':
            return [0, 0]
        prices = price_str.split('～')

        print(prices)
        if(prices[0] == '' and prices[1] != ''):
            return [prices[1].strip('￥').replace(',', ''), prices[1].strip('￥').replace(',', '')]
        elif(prices[0] != '' and prices[1] == ''):
            return [prices[0].strip('￥').replace(',', ''), prices[0].strip('￥').replace(',', '')]
        elif (len(prices) == 2):
            return [prices[0].strip('￥').replace(',', ''), prices[1].strip('￥').replace(',', '')]


    def parse_business_hours(self, response):
        item = BusinessHourItem()
        chart_list = response.xpath("//p[contains(@class, 'rstinfo-table__subject')]/../p").extract()
        # print(chart_list)
        time_start_key_list = []
        time_start_key_list.append('start_hour_1')
        time_start_key_list.append('start_hour_2')
        time_start_key_list.append('start_hour_3')
        time_start_key_list.append('start_hour_4')
        time_start_key_list.append('start_hour_5')
        time_start_key_list.append('start_hour_6')


        time_end_key_list = []
        time_end_key_list.append('end_hour_1')
        time_end_key_list.append('end_hour_2')
        time_end_key_list.append('end_hour_3')
        time_end_key_list.append('end_hour_4')
        time_end_key_list.append('end_hour_5')
        time_end_key_list.append('end_hour_6')


        item['category'] = self.category

        for line in chart_list:
            if '～' in line:
                # time_section_list = line.strip("<p>").split("<br>")
                # print(time_section_list)

                hours_regex = re.compile(r'(\d\d:\d\d～\d\d:\d\d)')
                hours_list = hours_regex.findall(line)
                # print(hours_list)
                self.logger.info('Hour list: %s', str(hours_list))

                for i in range(len(hours_list)):
                    self.logger.info('index: %s', str(i))

                    time_split = hours_list[i].split('～')
                    item[time_start_key_list[i]] = time_split[0]
                    item[time_end_key_list[i]] = time_split[1]

                break

        return item

    # def parse_hours(self, response):



        # name
        # rating
        # night price
        # evening price

        # # Shop ID
        # restaurant['restaurant_id'] = response.url.split('/')[6]

        # # Subarea ID
        # restaurant['subarea_id'] = response.url.split('/')[5]

        # restaurant['area_id'] = response.url.split('/')[4]

        # address_str = response.xpath("string(//p[contains(@class, 'rstinfo-table__address')])").get()
        # restaurant['address'] = address_str

        # # In [10]: response.xpath("//h2[contains(@class, 'display-name')]/a/text()").get()
        # # Out[10]: '麺屋武蔵 二天 池袋店'
        # name = response.xpath("//h2[contains(@class, 'display-name')]/a/text()").get().strip()
        # restaurant['name'] = name

        # restaurant['avg_rating'] = response.xpath("//span[contains(@class, 'rdheader-rating__score-val-dtl')]/text()").get().strip()

        # # review_links = LinkExtractor(allow=[r"tokyo/A.*/.*/.*/dtlrvwlst/B.*"], deny=[r"rstLst/.*",r"ramen/.*",r"dtlrvwlst/\?"]).extract_links(response)
        # # for link in review_links:
        # #     yield Request(link.url, callback=self.parse_review)

        # return restaurant
    
    # def parse_review(self, response):
    #     self.logger.info('Crawling Review at: %s', response.url)

    #     review = ReviewItem()

    #     # Shop ID
    #     review['restaurant_id'] = response.url.split('/')[6]

    #     # In [5]: response.xpath("//span[contains(@property, 'v:reviewer')]/text()").get()
    #     # Out[5]: 'tresc'
    #     review['user_id'] = response.xpath("//span[contains(@property, 'v:reviewer')]/text()").get()

    #     review['rating'] = response.xpath("//b[contains(@class, 'c-rating__val c-rating__val--strong')]/text()").get().strip()
        
    #     # In [27]: "".join(response.xpath("//div[contains(@class, 'rvw-item__rvw-comment')]//p//text()").getall()).strip()
    #     review_jp = "".join(response.xpath("//div[contains(@class, 'rvw-item__rvw-comment')]//p//text()").getall()).strip()
    #     review['review'] = review_jp