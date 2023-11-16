#!/usr/bin/env bash

#
# Exit values:
#  0 on success
#  1 on failure
#

#
# Removes all .json and .csv files from '../bike-routes/'
# and resets '../counter.json' bikes value to 1
#
function main {
    echo "Are you sure you want to reset?"
    echo "This will remove all previously generated data in bike-routes."
    echo "y | n"
    #
    # Process options
    #
    while read -r input;
    do
        case "$input" in

            Y | y | Yes | yes)
                echo "Removing json and csv files in '../bike-routes/' ..."
                for target in ../bike-routes/*.{json,csv}
                do
                    rm "$target"
                done
                echo "Generating new csv files..."
                printf "\"bike\",\"route_nr\",\"coords_as_polyline\"\\r\\n" > ../bike-routes/routes.csv
                echo "Resetting counter..."
                node './reset.js'
                echo "Done!"
                echo "Content of '../counter.json': "
                cat '../counter.json'
                echo
                echo "Content of '../bike-routes/': "
                ls -lA '../bike-routes/'
                exit 0
            ;;

            N | n | No | no)
                echo "That's a 'No', exiting with status 0"
                exit 0
            ;;

            *)
                echo "Taking that as a 'No', exiting with status 1"
                exit 1
            ;;
        esac
    done
    exit 1
}


main "$@"