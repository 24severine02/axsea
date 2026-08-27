import {courseDetail} from './objects/courseDetail'
import {ctaButton} from './objects/ctaButton'
import {orderItem} from './objects/orderItem'
import {productColor} from './objects/productColor'
import {timelineEntry} from './objects/timelineEntry'

import {aboutMe} from './singletons/aboutMe'
import {hero} from './singletons/hero'
import {mapSection} from './singletons/mapSection'
import {shopSettings} from './singletons/shopSettings'
import {siteSettings} from './singletons/siteSettings'
import {socialProof} from './singletons/socialProof'

import {catchLogEntry} from './documents/catchLogEntry'
import {course} from './documents/course'
import {fishingSpot} from './documents/fishingSpot'
import {gearItem} from './documents/gearItem'
import {order} from './documents/order'
import {product} from './documents/product'
import {sponsor} from './documents/sponsor'

export const schemaTypes = [
  // Singletons — one instance each, edited like a page
  siteSettings,
  hero,
  socialProof,
  aboutMe,
  mapSection,
  shopSettings,

  // Documents — repeatable content
  catchLogEntry,
  gearItem,
  course,
  fishingSpot,
  sponsor,
  product,
  order,

  // Objects — reusable field groups with no document of their own
  ctaButton,
  timelineEntry,
  productColor,
  orderItem,
  courseDetail,
]
