/**
 * Copyright © 2013-2017 Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import _ from 'underscore';
import ReadInterface from "../read-interface";
import {DataObject} from "../../data-store";
import StyleAttributeMapper from "../style-attribute-mapper";

export default class Default implements ReadInterface {
    styleAttributeMapper: StyleAttributeMapper;

    constructor() {
        this.styleAttributeMapper = new StyleAttributeMapper();
    }

    /**
     * Read data, style and css properties from the element
     *
     * @param element HTMLElement
     * @returns {Promise<any>}
     */
    public read (element: HTMLElement): Promise<any> {
        let data: DataObject = {};
        let styleAttributes: DataObject = {};
        for (let i = 0; i < element.style.length; i ++) {
            const property = element.style.item(i);

            if (element.style[property] !== '') {
                styleAttributes[property] = element.style[property];
            }
        }

        _.extend(data, this.styleAttributeMapper.fromDom(styleAttributes));

        Object.keys(element.dataset).map(key => {
            if (element.dataset[key] !== '') {
                data[key.split(/(?=[A-Z])/).join('_').toLowerCase()] = element.dataset[key];
            }
        });

        data['css_classes'] = element.className.split(' ').filter(value => value.length > 0);

        return new Promise((resolve: Function) => {
            resolve(data);
        });
    }
}