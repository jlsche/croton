import sys
import time
import hmac
import uuid
import base64
import urllib
import urllib.parse
from hashlib import sha1

access_key_id = "LTAIhkkCmeQu8SVd"
access_key_secret = "hLtbIuZDcWWs7ha1P8YsdzHGNMjEp3"
region_id = 'cn-hangzhou'
version = '2014-08-28'
scaling_rule_ari = 'ari:acs:ess:cn-hangzhou:1840903284313844:scalingrule/asr-bp1dwdfg32pr9cht8055'

def percentEncode(string):
    res = urllib.parse.quote(string, '')
    res = res.replace('+', '%20')
    res = res.replace('*', '%2A')
    res = res.replace('\'', '%27')
    res = res.replace('\"', '%22')
    res = res.replace('%7E', '~')
    return res

if __name__ == '__main__':
    timestamp = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    D = {
        'Format': 'JSON',
        'Version': version,
        #'Action': 'DescribeInstances',
        #'Action': 'ExecuteScalingRule',
        'Action': 'DescribeScalingGroups',
        #'Action': 'DescribeScalingInstances',
        #'Action': 'RemoveInstances',
        #'Action': 'DescribeScalingActivities',
        'ScalingRuleAri': scaling_rule_ari,
        'ScalingGroupId': "asg-bp1dwdfg32pr9aivomn7",
        'InstanceId.1': 'i-bp15ntizeb6wk4rhs4z6',
        'AccessKeyId': access_key_id,
        'RegionId': region_id,
        'SignatureVersion': '1.0',
        'SignatureMethod': 'HMAC-SHA1',
        'SignatureNonce': str(uuid.uuid1()),
        'Timestamp': timestamp,
    }

    sortedD = sorted(D.items(), key=lambda x: x[0])

    canstring = ''
    for key, val in sortedD:
        print('processing {}..'.format(key))
        canstring += '&' + percentEncode(key) + '=' + percentEncode(val)

    stringToSign = 'GET&%2F&' + percentEncode(canstring[1:])

    access_key_secret = "hLtbIuZDcWWs7ha1P8YsdzHGNMjEp3"
    h = hmac.new(str.encode(access_key_secret + '&'), str.encode(stringToSign), sha1)


    signature = base64.encodestring(h.digest()).strip()
    D['Signature'] = signature

    url = 'http://ess.aliyuncs.com/?' + urllib.parse.urlencode(D)

    print('\nRequest url: \n{}\n'.format(url))

    #request = urllib2.Request(url)
    #conn = urllib2.urlopen(request)
    #print(conn.read())


