SELENIUM_BROWSER=firefox node $1 

if [ $? -eq 0 ]
then   
  echo sim
else
  echo nao
fi
