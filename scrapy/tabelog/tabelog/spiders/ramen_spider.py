import scrapy
from scrapy.linkextractors import LinkExtractor
from scrapy.http.request import Request
from scrapy.spiders import CrawlSpider, Rule
# from googletrans import Translator

from tabelog.items import RestaurantItem, ReviewItem

class RamenSpider(CrawlSpider):
    name = "ramen"
    pagesToCrawl = 5
    start_urls = [
        'https://tabelog.com/tokyo/rstLst/ramen/' + str(i) for i in range(1,pagesToCrawl)
    ]
    
    # In [26]: LinkExtractor(allow=[r"tokyo/A.*/.*/.*/dtlrvwlst/"], deny=[r"rstLst/.*",r"ramen/.*",r"dtlrvwlst/\?",r"dtlrvwlst/[A-Z]"]).extract_links(response)
    rules = (
        # Rule(LinkExtractor(allow=[r"tokyo/A.*/.*/.*/"], deny=[r"rstLst/.*",r"dtlrvwlst/.*",r"ramen/.*"]), callback="parse_item", follow=True),
        Rule(LinkExtractor(allow=[r"tokyo/A.*/.*/.*/dtlrvwlst/"], deny=[r"rstLst/.*",r"ramen/.*",r"dtlrvwlst/\?",r"dtlrvwlst/[A-Z]"]), callback="parse_restaurant"),
        # Rule(LinkExtractor(allow=[r"tokyo/A.*/.*/.*/dtlrvwlst/B.*"], deny=[r"rstLst/.*",r"ramen/.*",r"dtlrvwlst/\?"]), callback="parse_review"),
    )

    def parse_restaurant(self, response):

        self.logger.info('Crawling restaurant at: %s', response.url)
        
        restaurant = RestaurantItem()

        # Shop ID
        restaurant['restaurant_id'] = response.url.split('/')[6]

        # Subarea ID
        restaurant['subarea_id'] = response.url.split('/')[5]

        restaurant['area_id'] = response.url.split('/')[4]

        address_str = response.xpath("string(//p[contains(@class, 'rstinfo-table__address')])").get()
        restaurant['address'] = address_str

        # In [10]: response.xpath("//h2[contains(@class, 'display-name')]/a/text()").get()
        # Out[10]: '麺屋武蔵 二天 池袋店'
        name = response.xpath("//h2[contains(@class, 'display-name')]/a/text()").get().strip()
        restaurant['name'] = name

        restaurant['avg_rating'] = response.xpath("//span[contains(@class, 'rdheader-rating__score-val-dtl')]/text()").get().strip()

        # review_links = LinkExtractor(allow=[r"tokyo/A.*/.*/.*/dtlrvwlst/B.*"], deny=[r"rstLst/.*",r"ramen/.*",r"dtlrvwlst/\?"]).extract_links(response)
        # for link in review_links:
        #     yield Request(link.url, callback=self.parse_review)

        return restaurant
    
    def parse_review(self, response):
        self.logger.info('Crawling Review at: %s', response.url)

        review = ReviewItem()

        # Shop ID
        review['restaurant_id'] = response.url.split('/')[6]

        # In [5]: response.xpath("//span[contains(@property, 'v:reviewer')]/text()").get()
        # Out[5]: 'tresc'
        review['user_id'] = response.xpath("//span[contains(@property, 'v:reviewer')]/text()").get()

        review['rating'] = response.xpath("//b[contains(@class, 'c-rating__val c-rating__val--strong')]/text()").get().strip()
        
        # In [27]: "".join(response.xpath("//div[contains(@class, 'rvw-item__rvw-comment')]//p//text()").getall()).strip()
        review_jp = "".join(response.xpath("//div[contains(@class, 'rvw-item__rvw-comment')]//p//text()").getall()).strip()
        review['review'] = review_jp