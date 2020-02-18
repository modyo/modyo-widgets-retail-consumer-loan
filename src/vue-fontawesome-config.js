import Vue from 'vue';

import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faPencilAlt, faTrashAlt, faChevronDown, faFilePdf, faBan, faChevronRight, faChevronLeft, faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { faCcVisa } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faPencilAlt, faTrashAlt, faChevronDown, faFilePdf, faCcVisa, faBan, faChevronRight, faChevronLeft, faTimes);


Vue.component('font-awesome-icon', FontAwesomeIcon);
