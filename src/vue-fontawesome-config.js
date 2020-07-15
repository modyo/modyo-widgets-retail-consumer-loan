import Vue from 'vue';

import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faArrowLeft, faChevronRight, faChevronLeft, faArrowCircleLeft, faBan, faCheck,
} from '@fortawesome/free-solid-svg-icons';
import { } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faArrowLeft, faChevronRight, faChevronLeft, faArrowCircleLeft, faBan, faCheck);

Vue.component('font-awesome-icon', FontAwesomeIcon);
