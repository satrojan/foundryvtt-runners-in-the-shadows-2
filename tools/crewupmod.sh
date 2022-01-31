#!/bin/bash
input="./crewupgrades.txt"
while IFS=":" read -r col1 col2 col3 col4 col5
do
echo {\"_id\":\"$col1\",\"name\":\"$col4\",\"permission\":{\"default\":0,\"BwbqQh8sHfeKmUax\":3},\"type\":\"crew_upgrade\",\"data\":{\"description\":\"$col5\",\"class\":\"$col3\",\"price\":\"$col2\",\"logic\":\"\",\"crew_type\":\"\"},\"folder\":null,\"sort\":2500000,\"flags\":{}}

done < "$input"

#FuwPoxJeCdPH7VlN:1:Dealers:(D) Elite Rooks:All of your cohorts with the Rooks type get +1d to quality rolls for Rook-related actions.
#
##{"_id":"ydS2afjt3GUZD7HQ","name":"(Sh) Steady","permission":{"default":0,"BwbqQh8sHfeKmUax":3},"type":"crew_upgrade","data":{"description":"Each PC gets +1 stress box.","class":"Shadows","price":"3","logic":"","crew_type":""},"folder":null,"sort":2500000,"flags":{}}
##{"_id":"yuiTW23NDa1wsZvV","name":"(A) Ironhook Contacts","permission":{"default":0,"BwbqQh8sHfeKmUax":3},"type":"crew_upgrade","data":{"description":"Your Tier is effectively +1 higher in prison. This counts for any Tier-related element in prison, including the incarceration roll. See page 148 of the Manual for details.","class":"Assassins","price":"1","logic":"","crew_type":""},"folder":null,"sort":200000,"flags":{}}
##{"_id":"zXJn9J8opCWWgIUN","name":"Quality: Tools","permission":{"default":0,"BwbqQh8sHfeKmUax":3},"type":"crew_upgrade","data":{"description":"Upgrade improves the quality rating of all the PCs' items of that type, beyond the quality established by the crew's Tier and fine items. Covers Demolitions Tools and Tinkering Tools.","class":"","price":"1","logic":"","crew_type":""},"folder":null,"sort":2500001,"flags":{}}
##{"_id":"zsoUfu8nsM0cAcqZ","name":"(Sh) Underground Maps and Passkeys","permission":{"default":0,"BwbqQh8sHfeKmUax":3},"type":"crew_upgrade","data":{"description":"You have easy passage through the underground canals, tunnels, and basements of the city.","class":"Shadows","price":"1","logic":"","crew_type":""},"folder":null,"sort":2300000,"flags":{}}

