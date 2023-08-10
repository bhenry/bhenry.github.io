#bin/bash


SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

> $SCRIPT_DIR/index.list

for file in `ls -p $SCRIPT_DIR/..`
do

    if [[ $file == *"/" ]]; then
        continue
    fi

    echo $file >> $SCRIPT_DIR/index.list

done

cat $SCRIPT_DIR/index.list
