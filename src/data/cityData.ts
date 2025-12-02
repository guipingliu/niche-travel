// 中国省市区数据（简化版，包含主要城市）
export interface District {
    code: string;
    name: string;
}

export interface City {
    code: string;
    name: string;
    districts?: District[];
}

export interface Province {
    code: string;
    name: string;
    cities: City[];
}

export const chinaRegions: Province[] = [
    {
        code: '110000',
        name: '北京市',
        cities: [
            {
                code: '110100',
                name: '北京市',
                districts: [
                    { code: '110101', name: '东城区' },
                    { code: '110102', name: '西城区' },
                    { code: '110105', name: '朝阳区' },
                    { code: '110106', name: '丰台区' },
                    { code: '110107', name: '石景山区' },
                    { code: '110108', name: '海淀区' },
                    { code: '110109', name: '门头沟区' },
                    { code: '110111', name: '房山区' },
                    { code: '110112', name: '通州区' },
                    { code: '110113', name: '顺义区' },
                    { code: '110114', name: '昌平区' },
                    { code: '110115', name: '大兴区' },
                    { code: '110116', name: '怀柔区' },
                    { code: '110117', name: '平谷区' },
                    { code: '110118', name: '密云区' },
                    { code: '110119', name: '延庆区' }
                ]
            }
        ]
    },
    {
        code: '310000',
        name: '上海市',
        cities: [
            {
                code: '310100',
                name: '上海市',
                districts: [
                    { code: '310101', name: '黄浦区' },
                    { code: '310104', name: '徐汇区' },
                    { code: '310105', name: '长宁区' },
                    { code: '310106', name: '静安区' },
                    { code: '310107', name: '普陀区' },
                    { code: '310109', name: '虹口区' },
                    { code: '310110', name: '杨浦区' },
                    { code: '310112', name: '闵行区' },
                    { code: '310113', name: '宝山区' },
                    { code: '310114', name: '嘉定区' },
                    { code: '310115', name: '浦东新区' },
                    { code: '310116', name: '金山区' },
                    { code: '310117', name: '松江区' },
                    { code: '310118', name: '青浦区' },
                    { code: '310120', name: '奉贤区' },
                    { code: '310151', name: '崇明区' }
                ]
            }
        ]
    },
    {
        code: '330000',
        name: '浙江省',
        cities: [
            {
                code: '330100',
                name: '杭州市',
                districts: [
                    { code: '330102', name: '上城区' },
                    { code: '330105', name: '拱墅区' },
                    { code: '330106', name: '西湖区' },
                    { code: '330108', name: '滨江区' },
                    { code: '330109', name: '萧山区' },
                    { code: '330110', name: '余杭区' },
                    { code: '330111', name: '富阳区' },
                    { code: '330112', name: '临安区' }
                ]
            },
            {
                code: '330200',
                name: '宁波市',
                districts: [
                    { code: '330203', name: '海曙区' },
                    { code: '330205', name: '江北区' },
                    { code: '330206', name: '北仑区' },
                    { code: '330211', name: '镇海区' },
                    { code: '330212', name: '鄞州区' },
                    { code: '330213', name: '奉化区' }
                ]
            },
            { code: '330300', name: '温州市' },
            { code: '330400', name: '嘉兴市' },
            { code: '330500', name: '湖州市' },
            { code: '330600', name: '绍兴市' },
            { code: '330700', name: '金华市' },
            { code: '330800', name: '衢州市' },
            { code: '330900', name: '舟山市' },
            { code: '331000', name: '台州市' },
            { code: '331100', name: '丽水市' }
        ]
    },
    {
        code: '320000',
        name: '江苏省',
        cities: [
            {
                code: '320100',
                name: '南京市',
                districts: [
                    { code: '320102', name: '玄武区' },
                    { code: '320104', name: '秦淮区' },
                    { code: '320105', name: '建邺区' },
                    { code: '320106', name: '鼓楼区' },
                    { code: '320111', name: '浦口区' },
                    { code: '320113', name: '栖霞区' },
                    { code: '320114', name: '雨花台区' },
                    { code: '320115', name: '江宁区' }
                ]
            },
            { code: '320200', name: '无锡市' },
            { code: '320300', name: '徐州市' },
            { code: '320400', name: '常州市' },
            { code: '320500', name: '苏州市' },
            { code: '320600', name: '南通市' },
            { code: '320700', name: '连云港市' },
            { code: '320800', name: '淮安市' },
            { code: '320900', name: '盐城市' },
            { code: '321000', name: '扬州市' },
            { code: '321100', name: '镇江市' },
            { code: '321200', name: '泰州市' },
            { code: '321300', name: '宿迁市' }
        ]
    },
    {
        code: '510000',
        name: '四川省',
        cities: [
            {
                code: '510100',
                name: '成都市',
                districts: [
                    { code: '510104', name: '锦江区' },
                    { code: '510105', name: '青羊区' },
                    { code: '510106', name: '金牛区' },
                    { code: '510107', name: '武侯区' },
                    { code: '510108', name: '成华区' },
                    { code: '510112', name: '龙泉驿区' },
                    { code: '510113', name: '青白江区' },
                    { code: '510114', name: '新都区' },
                    { code: '510115', name: '温江区' },
                    { code: '510116', name: '双流区' },
                    { code: '510117', name: '郫都区' }
                ]
            },
            { code: '510300', name: '自贡市' },
            { code: '510400', name: '攀枝花市' },
            { code: '510500', name: '泸州市' },
            { code: '510600', name: '德阳市' },
            { code: '510700', name: '绵阳市' },
            { code: '510800', name: '广元市' },
            { code: '510900', name: '遂宁市' },
            { code: '511000', name: '内江市' },
            { code: '511100', name: '乐山市' },
            { code: '511300', name: '南充市' },
            { code: '511400', name: '眉山市' },
            { code: '511500', name: '宜宾市' },
            { code: '511600', name: '广安市' },
            { code: '511700', name: '达州市' },
            { code: '511800', name: '雅安市' },
            { code: '511900', name: '巴中市' },
            { code: '512000', name: '资阳市' }
        ]
    },
    {
        code: '440000',
        name: '广东省',
        cities: [
            {
                code: '440100',
                name: '广州市',
                districts: [
                    { code: '440103', name: '荔湾区' },
                    { code: '440104', name: '越秀区' },
                    { code: '440105', name: '海珠区' },
                    { code: '440106', name: '天河区' },
                    { code: '440111', name: '白云区' },
                    { code: '440112', name: '黄埔区' },
                    { code: '440113', name: '番禺区' },
                    { code: '440114', name: '花都区' },
                    { code: '440115', name: '南沙区' },
                    { code: '440117', name: '从化区' },
                    { code: '440118', name: '增城区' }
                ]
            },
            {
                code: '440300',
                name: '深圳市',
                districts: [
                    { code: '440303', name: '罗湖区' },
                    { code: '440304', name: '福田区' },
                    { code: '440305', name: '南山区' },
                    { code: '440306', name: '宝安区' },
                    { code: '440307', name: '龙岗区' },
                    { code: '440308', name: '盐田区' },
                    { code: '440309', name: '龙华区' },
                    { code: '440310', name: '坪山区' },
                    { code: '440311', name: '光明区' }
                ]
            },
            { code: '440200', name: '韶关市' },
            { code: '440400', name: '珠海市' },
            { code: '440500', name: '汕头市' },
            { code: '440600', name: '佛山市' },
            { code: '440700', name: '江门市' },
            { code: '440800', name: '湛江市' },
            { code: '440900', name: '茂名市' },
            { code: '441200', name: '肇庆市' },
            { code: '441300', name: '惠州市' },
            { code: '441400', name: '梅州市' },
            { code: '441500', name: '汕尾市' },
            { code: '441600', name: '河源市' },
            { code: '441700', name: '阳江市' },
            { code: '441800', name: '清远市' },
            { code: '441900', name: '东莞市' },
            { code: '442000', name: '中山市' },
            { code: '445100', name: '潮州市' },
            { code: '445200', name: '揭阳市' },
            { code: '445300', name: '云浮市' }
        ]
    },
    {
        code: '500000',
        name: '重庆市',
        cities: [
            {
                code: '500100',
                name: '重庆市',
                districts: [
                    { code: '500101', name: '万州区' },
                    { code: '500102', name: '涪陵区' },
                    { code: '500103', name: '渝中区' },
                    { code: '500104', name: '大渡口区' },
                    { code: '500105', name: '江北区' },
                    { code: '500106', name: '沙坪坝区' },
                    { code: '500107', name: '九龙坡区' },
                    { code: '500108', name: '南岸区' },
                    { code: '500109', name: '北碚区' },
                    { code: '500110', name: '綦江区' },
                    { code: '500111', name: '大足区' },
                    { code: '500112', name: '渝北区' },
                    { code: '500113', name: '巴南区' },
                    { code: '500114', name: '黔江区' },
                    { code: '500115', name: '长寿区' },
                    { code: '500116', name: '江津区' },
                    { code: '500117', name: '合川区' },
                    { code: '500118', name: '永川区' },
                    { code: '500119', name: '南川区' }
                ]
            }
        ]
    },
    {
        code: '540000',
        name: '西藏自治区',
        cities: [
            { code: '540100', name: '拉萨市' },
            { code: '540200', name: '日喀则市' },
            { code: '540300', name: '昌都市' },
            { code: '540400', name: '林芝市' },
            { code: '540500', name: '山南市' },
            { code: '540600', name: '那曲市' },
            { code: '542500', name: '阿里地区' }
        ]
    },
    {
        code: '530000',
        name: '云南省',
        cities: [
            { code: '530100', name: '昆明市' },
            { code: '530300', name: '曲靖市' },
            { code: '530400', name: '玉溪市' },
            { code: '530500', name: '保山市' },
            { code: '530600', name: '昭通市' },
            { code: '530700', name: '丽江市' },
            { code: '530800', name: '普洱市' },
            { code: '530900', name: '临沧市' },
            { code: '532300', name: '楚雄彝族自治州' },
            { code: '532500', name: '红河哈尼族彝族自治州' },
            { code: '532600', name: '文山壮族苗族自治州' },
            { code: '532800', name: '西双版纳傣族自治州' },
            { code: '532900', name: '大理白族自治州' },
            { code: '533100', name: '德宏傣族景颇族自治州' },
            { code: '533300', name: '怒江傈僳族自治州' },
            { code: '533400', name: '迪庆藏族自治州' }
        ]
    }
];

// 辅助函数：根据省份代码获取城市列表
export const getCitiesByProvince = (provinceCode: string): City[] => {
    const province = chinaRegions.find(p => p.code === provinceCode);
    return province?.cities || [];
};

// 辅助函数：根据城市代码获取区县列表
export const getDistrictsByCity = (provinceCode: string, cityCode: string): District[] => {
    const province = chinaRegions.find(p => p.code === provinceCode);
    const city = province?.cities.find(c => c.code === cityCode);
    return city?.districts || [];
};

// 辅助函数：根据代码获取名称
export const getRegionName = (code: string): string => {
    for (const province of chinaRegions) {
        if (province.code === code) return province.name;
        for (const city of province.cities) {
            if (city.code === code) return city.name;
            if (city.districts) {
                const district = city.districts.find(d => d.code === code);
                if (district) return district.name;
            }
        }
    }
    return '';
};
